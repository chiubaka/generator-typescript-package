import {
  GeneratorFeatures,
  GeneratorOptions,
  Question,
} from "yeoman-generator";

import { BaseGenerator } from "../shared";
import { GitHubApiAdapter } from "./GitHubApiAdapter";

export interface GitHubGeneratorOptions {
  repoOwner: string;
  repoName: string;
  packageDescription: string;
  isPrivateRepo: boolean;
}

interface LabelOptions {
  name: string;
  description: string;
  color: string;
}

export class GitHubGenerator extends BaseGenerator<GitHubGeneratorOptions> {
  private github: GitHubApiAdapter;

  public static getQuestions(): Question<GitHubGeneratorOptions>[] {
    return [
      {
        type: "input",
        name: "repoOwner",
        message: "Who owns this repository?",
        default: "chiubaka",
      },
      {
        type: "input",
        name: "repoName",
        message: "What is the name of this new repo?",
        default: "generated-typescript-package",
      },
      {
        type: "input",
        name: "packageDescription",
        message: "What is the description of this new package?",
        default:
          "A TypeScript package generated by chiubaka/generator-chiubaka-typescript-package",
      },
      {
        type: "confirm",
        name: "isPrivateRepo",
        message: "Should this repo be private?",
        default: false,
      },
    ];
  }

  constructor(
    args: string | string[],
    options: GeneratorOptions,
    features?: GeneratorFeatures
  ) {
    super(args, options, features);

    this.github = new GitHubApiAdapter();
  }

  public async writing() {
    await this.createOrUpdateRepository();
    await this.protectMasterBranch();
    await this.enableVulnerabilityAlerts();
    await this.createOrUpdateLabels();
  }

  private createOrUpdateRepository = async () => {
    const {
      isPrivateRepo,
      packageDescription: description,
      repoName: name,
      repoOwner: owner,
    } = this.answers;

    await this.github.createOrUpdateRepo({
      owner,
      name,
      description,
      isPrivate: isPrivateRepo,
      hasIssues: true,
      allowAutoMerge: true,
      allowMergeCommit: false,
      allowRebaseMerge: true,
      allowSquashMerge: true,
      allowUpdateBranch: true,
      deleteBranchOnMerge: true,
      useSquashPrTitleAsDefault: true,
    });
  };

  private protectMasterBranch = async () => {
    const { repoOwner, repoName } = this.answers;

    await this.github.updateBranchProtection({
      repoOwner,
      repoName,
      branch: "master",
      requiredStatusChecks: [
        "codecov/patch",
        "codecov/project",
        "lint-build-test-publish",
      ],
      requiredStatusChecksStrict: true,
      requiredApprovingReviewCount: 0,
      requiredLinearHistory: true,
      allowForcePushes: false,
      allowDeletions: false,
      requiredConversationResolution: true,
      enforceAdmins: false,
    });

    await this.github.createCommitSignatureProtection(
      repoOwner,
      repoName,
      "master"
    );
  };

  private enableVulnerabilityAlerts = async () => {
    const { repoOwner, repoName } = this.answers;

    await this.github.enableVulnerabilityAlerts(repoOwner, repoName);
  };

  private createOrUpdateLabels = async () => {
    await this.createOrUpdatePriorityLabels();
    await this.createOrUpdateIssueTypeLabels();
    await this.createOrUpdateStateLabels();
  };

  private createOrUpdateLabel = async (options: LabelOptions) => {
    const { repoOwner: repoOwner, repoName } = this.answers;

    await this.github.createOrUpdateLabel({
      repoOwner,
      repoName,
      ...options,
    });
  };

  private createOrUpdatePriorityLabels = async () => {
    await this.createOrUpdateLabel({
      name: ":fire: P0",
      description: "Fire. Drop everything and fix this ASAP.",
      color: "D93F0B",
    });

    await this.createOrUpdateLabel({
      name: ":triangular_flag_on_post: P1",
      description: "High priority. Resolve in the next few days.",
      color: "FFA500",
    });

    await this.createOrUpdateLabel({
      name: ":warning: P2",
      description: "Important. Resolve by next release.",
      color: "FBCA04",
    });

    await this.createOrUpdateLabel({
      name: ":grey_exclamation: P3",
      description:
        "Low priority. Possibly nice to have. Resolve if time allows.",
      color: "0E8A16",
    });

    await this.createOrUpdateLabel({
      name: ":icecream: P4",
      description:
        "Extremely low priority. Probably not worth spending time on right now.",
      color: "1D76DB",
    });
  };

  private createOrUpdateIssueTypeLabels = async () => {
    await this.createOrUpdateLabel({
      name: ":bug: bug",
      description: "Something isn't working.",
      color: "D93F0B",
    });

    await this.createOrUpdateLabel({
      name: ":muscle: improvement",
      description: "An improvement on something existing.",
      color: "A2EEEF",
    });

    await this.createOrUpdateLabel({
      name: ":sparkles: feature",
      description: "New feature or request.",
      color: "5319E7",
    });

    await this.createOrUpdateLabel({
      name: ":money_mouth_face: tech debt",
      description: "Things weighing down the stack over the long-term.",
      color: "000000",
    });
  };

  private createOrUpdateStateLabels = async () => {
    await this.createOrUpdateLabel({
      name: ":no_entry_sign: blocked",
      description: "Blocked on something external. Waiting to be unblocked.",
      color: "D93F0B",
    });

    await this.createOrUpdateLabel({
      name: ":eyes: awaiting review",
      description: "Requires review before proceeding.",
      color: "FBCA04",
    });
  };
}
