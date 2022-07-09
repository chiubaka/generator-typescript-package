import path from "node:path";

import { BaseGenerator } from "../../shared/index";
import { CodeCovGenerator } from "./codecov/index";

export class TestCoverageGenerator extends BaseGenerator {
  public initializing() {
    this.composeWithSubGenerator({
      Generator: CodeCovGenerator,
      path: path.join(__dirname, "./codecov"),
    });
  }
}
