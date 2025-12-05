import * as cron from 'node-cron';
import { TefasService, RefreshWindow } from '../tefas/service';

export interface ScheduleConfig {
  morning?: string;
  midday?: string;
  evening?: string;
  window?: RefreshWindow;
  timezone?: string;
}

const DEFAULT_SCHEDULES: ScheduleConfig = {
  morning: '0 9 * * 1-5',
  midday: '0 13 * * 1-5',
  evening: '0 18 * * 1-5',
  window: 'all',
};

export class TefasScheduler {
  private tasks: cron.ScheduledTask[] = [];

  constructor(
    private readonly service: TefasService,
    private readonly config: ScheduleConfig = {}
  ) {
    this.config = { ...DEFAULT_SCHEDULES, ...config };
  }

  private async executeSync(jobName: string, window: RefreshWindow = 'all'): Promise<void> {
    console.log(`[${new Date().toISOString()}] Starting ${jobName} sync (window: ${window})`);
    try {
      const result = await this.service.syncFunds(window);
      console.log(
        `[${new Date().toISOString()}] ${jobName} sync completed: ${result.fundsSynced} funds synced from ${result.source}`
      );
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ${jobName} sync failed:`, error);
    }
  }

  private scheduleTask(expression: string, label: string, window: RefreshWindow) {
    const task = this.config.timezone
      ? cron.schedule(expression, () => this.executeSync(label, window), { timezone: this.config.timezone })
      : cron.schedule(expression, () => this.executeSync(label, window));

    this.tasks.push(task);
    console.log(`${label} sync scheduled: ${expression} (window: ${window}${this.config.timezone ? `, tz: ${this.config.timezone}` : ''})`);
  }

  start(): void {
    const window = this.config.window || 'all';

    if (this.config.morning) {
      this.scheduleTask(this.config.morning, 'Morning', window);
    }

    if (this.config.midday) {
      this.scheduleTask(this.config.midday, 'Midday', window);
    }

    if (this.config.evening) {
      this.scheduleTask(this.config.evening, 'Evening', window);
    }

    console.log(`TEFAS Scheduler started with ${this.tasks.length} scheduled jobs`);
  }

  stop(): void {
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    console.log('TEFAS Scheduler stopped');
  }

  async manualSync(window: RefreshWindow = 'all'): Promise<void> {
    await this.executeSync('Manual', window);
  }
}
