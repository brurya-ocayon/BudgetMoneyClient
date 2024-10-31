
export class Area {
    id: number;
    description: string;
    type: number;
    index: number = 1;
    sum: number | null;
    inEdit: boolean;
    isMaaser: boolean | null;
    isActive?: boolean = true;
    indexOn?: boolean;
}
