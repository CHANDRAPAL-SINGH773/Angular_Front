export class DropdownList {
    FlagId: number;
    Id: string;
    Label: string;
    
    constructor(options: {
        flagId: number;
        value: string;
        label: string;
    }) {
        this.FlagId = options.flagId;
        this.Id = options.value;
        this.Label = options.label;
    }
}