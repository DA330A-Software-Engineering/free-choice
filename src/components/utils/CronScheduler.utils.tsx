import { CronJob } from 'cron';

export class CronScheduler {
	private static instance: CronScheduler;

	private constructor() {}

	public static getInstance(): CronScheduler {
		if (!CronScheduler.instance) {
		CronScheduler.instance = new CronScheduler();
		}
		return CronScheduler.instance;
	}

	public createCronJob(dayOfWeek: number, hour: number, minute: number, toggleDevice: (deviceId: string) => void, deviceId: string): CronJob {
		const cronTime = `0 ${minute} ${hour} * * ${dayOfWeek}`;
		const job = new CronJob(cronTime, () => toggleDevice(deviceId));
		job.start();
		return job;
	}
}
