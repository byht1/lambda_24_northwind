export class CalculateExecutionTime {
  startTime: Date;
  finishTime: Date;
  executionTimeToSecond: number;

  constructor(start: number, public querySqlLog: string, finishTime: number = Date.now()) {
    this.startTime = new Date(start);
    this.finishTime = new Date(finishTime);
    this.executionTimeToSecond = this.calculateExecutionTimeSecond(start, finishTime);
  }

  private calculateExecutionTimeSecond = (start: number, finishTime: number) => {
    return (finishTime - start) / 1000;
  };
}
