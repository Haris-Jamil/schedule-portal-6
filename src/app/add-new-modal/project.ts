export class Project{
    
    submitByDay: number
    submitByMonth: number
    submitByYear: number
    submitByHour: number
    submitByMin: string
    submitByMeridiem: string;
    submitByTimeZone: string;
    FolderAssignDay: number
    FolderAssignMonth: number
    FolderAssignYear: number
    title: string;
    state: string;
    code: string;
    bidType: string;
    reasonNotBidding: string;
    epnum: string

    constructor(){
        this.submitByDay = null;
        this.submitByMonth = null;
        this.submitByYear = null;
        this.submitByHour = 10;
        this.submitByMin = '00';
        this.submitByMeridiem = 'AM';
        this.submitByTimeZone = 'EST';
        this.FolderAssignDay = null;
        this.FolderAssignMonth = null;
        this.FolderAssignYear = null;
        this.title = null;
        this.state = null;
        this.code = null;
        this.bidType = null;
        this.reasonNotBidding = null;
        this.epnum = null;
    }
    
}