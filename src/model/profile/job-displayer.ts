import { JOB } from "./job.enum";

export const jobDisplayer: { [key in JOB]: { displayer: string } } = {
    STUDENT: { displayer: 'Sinh viên' },
    SUPPORTER: { displayer: 'Nội trợ' },
    WORKER: { displayer: 'Nhân viên' },
};
