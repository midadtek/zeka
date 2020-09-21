import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import { PopoverController } from '@ionic/angular';

const { Storage } = Plugins;
@Component({
  selector: 'app-country-popover',
  templateUrl: './country-popover.component.html',
  styleUrls: ['./country-popover.component.scss'],
})

export class CountryPopoverComponent implements OnInit {
  allCountries: any[] = [];
  countriesName: string[] = [];
  isLoading: Boolean = false; 

  constructor( private category: Category_operationsService,public popoverController: PopoverController ) { }

  ngOnInit(){
    this.isLoading = true;
    this.category.getAllCountries().subscribe(data => {
      this.allCountries = data as any;
      console.log(this.allCountries);
      for( let i = 0; i < this.allCountries.length; i++){
        this.countriesName.push(this.allCountries[i].country_code);
      }
      this.isLoading = false;      
    })
  }
  async setItem(code) {
    await Storage.set({
      key: 'country_code',
      value: code
    });
    await this.popoverController.dismiss()
    console.log('inserted')
  }

}
