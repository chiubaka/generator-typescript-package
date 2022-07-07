import path from "node:path";

import CircleCiGenerator from "../circleci";
import { GitignoreGenerator } from "../gitignore";
import { NodeModuleGenerator } from "../node-module";
import { BaseGenerator } from "../shared";
import { TypeScriptGenerator } from "../typescript";

export class TypeScriptPackageGenerator extends BaseGenerator {
  public initializing() {
    this.composeWith([
      {
        Generator: NodeModuleGenerator,
        path: path.join(__dirname, "../node-module"),
      },
      {
        Generator: GitignoreGenerator,
        path: path.join(__dirname, "../gitignore"),
      },
      {
        Generator: TypeScriptGenerator,
        path: path.join(__dirname, "../typescript"),
      },
      {
        Generator: CircleCiGenerator,
        path: path.join(__dirname, "../circleci"),
      },
    ]);
  }
}
