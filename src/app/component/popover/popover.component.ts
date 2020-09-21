import { Component, OnInit} from '@angular/core';
import { Category_operationsService } from 'src/app/services/category_operations.service';
import { Plugins } from '@capacitor/core';
import { PopoverController } from '@ionic/angular';
const { Storage } = Plugins;

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  allCurrencies: any[];
  isLoading: boolean = false;
  currenciesName: string[]=[];

  constructor(private category: Category_operationsService,public popoverController: PopoverController) { }

  ngOnInit() {
    this.isLoading = true;
    this.category.getAllCurrencies().subscribe(data => {
      this.allCurrencies = data as any;
      console.log(this.allCurrencies);
      for( let i = 0; i < this.allCurrencies.length; i++){
        this.currenciesName.push(this.allCurrencies[i].code);
      }
      this.isLoading = false;      
    })
  }
  async setItem(code) {
    await Storage.set({
      key: 'currency_code',
      value: code
    });
    await this.popoverController.dismiss()
    console.log('inserted')
  }

}
