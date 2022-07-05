import Generator from "yeoman-generator";

export abstract class BaseGenerator extends Generator {
  public copyTemplate = (
    from: string,
    to: string,
    context?: Record<string, any>
  ) => {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context);
  };
}
