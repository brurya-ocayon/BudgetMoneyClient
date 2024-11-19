import { IdName } from "./id-name";

export class Debt {
    id: number;
    description: string;
    payments: number;
    urgency: IdName;
    userId: number;
    sum: number;
    isActive: boolean = true;
    inEdit: boolean;
    constructor() {
        this.payments=1;
        this.urgency = new IdName();
        this.urgency.id = 0;
    }
}
