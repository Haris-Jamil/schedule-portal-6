import { Component, OnInit } from '@angular/core';
import { TypeService } from '../service/type.service';


@Component({
  selector: 'app-type-manager-modal',
  templateUrl: './type-manager-modal.component.html',
  styleUrls: ['./type-manager-modal.component.css']
})
export class TypeManagerModalComponent implements OnInit {

  newType = '';
  allTypes: any[] = [];

  constructor(private typeService: TypeService) { }

  ngOnInit() {
    this.getAllTypes();
  }

  addType() {
    if (this.newType && !this.isDuplicate()) {
      this.typeService.addType(this.newType).subscribe( (resp) => {
        if (resp == 1 ) {
          this.getAllTypes();
        }
      });
    } else {
      this.newType = '';
    }
  }

  isDuplicate(): boolean {
    return this.allTypes.some((type) => {
      return (type.title as string).toLowerCase() === this.newType.toLocaleLowerCase()
    });
  }

  deleteType(id) {
    if( confirm('Are you sure you want to delete this user?') ) {
      this.typeService.deleteType(id).subscribe( (resp) => {
        if (resp == 1 ) {
          this.getAllTypes();
        }
      });  
    }    
  }

  getAllTypes() {
    this.typeService.getAllTypes().subscribe((resp: any) => {
      if (resp && resp.length) {
        this.allTypes = resp;
      } 
    })
  }

}
