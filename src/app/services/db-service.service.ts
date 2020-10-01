import { Injectable } from '@angular/core';
    import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface operation {
    id: number,
    category_id: number,
    category_name: string,
    country_id: number,
    currency_type: string,
    d_val_1: number,
    d_val_2: number,
    d_val_3: number,
    name: string,
    user_id: number,
    created_at: Date
}



@Injectable({
  providedIn: 'root'
})

export class DbServiceService {
    private database: SQLiteObject;
    private _operation: BehaviorSubject<operation[]> = new  BehaviorSubject<operation[]>([]);
    private operationByCategory:  BehaviorSubject<operation[]> = new  BehaviorSubject<operation[]>([]);
    private operationByCategoryLimited:  BehaviorSubject<operation[]> = new  BehaviorSubject<operation[]>([]);
    constructor(private sqlite: SQLite) { }

    

dbInit() {
    this.sqlite.create({
        name: 'zekat.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
        
         this.database = db;

          db.executeSql(`create table IF NOT EXISTS 'operations' (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               category_id INTEGER NOT NULL,
               category_name text NOT NULL,
               country_id INTEGER NOT NULL,
               currency_type null DEFAULT null,
               d_val_1 INTEGER null DEFAULT null,
               d_val_2 INTEGER null DEFAULT null,
               d_val_3 INTEGER null DEFAULT null,
               name varchar(255) null DEFAULT null,
               user_id INTEGER NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

          )`, [])

        db.executeSql(`DROP TABLE IF EXISTS payments`,[])

        db.executeSql(`create table IF NOT EXISTS 'payments' (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        charity_name text NOT NULL ,
        payment_value double NOT NULL,
        payment_data date NOT NULL,
        currency_type text,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) `,[] )


            this.loadAllOperations();
            db.executeSql(`SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`,[])
        })


}

loadAllOperations() {
    return this.database.executeSql(`SELECT * FROM operations ORDER BY created_at DESC`, []).then(data => {
        let loadedOperation: operation[] = []
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                loadedOperation.push({
                    id: data.rows.item(i).id,
                    category_id: data.rows.item(i).category_id,
                    category_name: data.rows.item(i).category_name,
                    country_id: data.rows.item(i).country_id,
                    currency_type: data.rows.item(i).currency_type,
                    d_val_1: data.rows.item(i).d_val_1,
                    d_val_2: data.rows.item(i).d_val_2,
                    d_val_3: data.rows.item(i).d_val_3,
                    name:data.rows.item(i).name,
                    user_id:data.rows.item(i).user_id,
                    created_at:data.rows.item(i).created_at 
                })
            }
        }
        this._operation.next(loadedOperation)
    }
        )
}
loadAllOperationsByCategoryLimited(id) {
    return this.database.executeSql(`SELECT * FROM operations where category_id = ${id} ORDER BY created_at DESC LIMIT 10`, []).then(data => {
        let operationByCategoryLimited: operation[] = []
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                operationByCategoryLimited.push({
                    id: data.rows.item(i).id,
                    category_id: data.rows.item(i).category_id,
                    category_name: data.rows.item(i).category_name,
                    country_id: data.rows.item(i).country_id,
                    currency_type: data.rows.item(i).currency_type,
                    d_val_1: data.rows.item(i).d_val_1,
                    d_val_2: data.rows.item(i).d_val_2,
                    d_val_3: data.rows.item(i).d_val_3,
                    name:data.rows.item(i).name,
                    user_id:data.rows.item(i).user_id,
                    created_at:data.rows.item(i).created_at 
                })
            }
        }
        this.operationByCategoryLimited.next(operationByCategoryLimited)
    }
        )
}
loadAllOperationsByCategory(id: number) {
    return this.database.executeSql(`SELECT * FROM operations where category_id =?`, [id]).then(data => {
        let operationByCategory: operation[] = []
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                operationByCategory.push({
                    id: data.rows.item(i).id,
                    category_id: data.rows.item(i).category_id,
                    category_name: data.rows.item(i).category_name,
                    country_id: data.rows.item(i).country_id,
                    currency_type: data.rows.item(i).currency_type,
                    d_val_1: data.rows.item(i).d_val_1,
                    d_val_2: data.rows.item(i).d_val_2,
                    d_val_3: data.rows.item(i).d_val_3,
                    name:data.rows.item(i).name,
                    user_id:data.rows.item(i).user_id,
                    created_at:data.rows.item(i).created_at 
                })
            }
        }
        this.operationByCategory.next(operationByCategory)
    }
        )
}

deleteOperationById(id) {
    return this.database.executeSql(`DELETE FROM operations where id = ?`, [id])
}
deleteOperationByCategoryId(id) {
    return this.database.executeSql(`DELETE FROM operations where category_id = ?`, [id])  
}




getoperations() {
    return this._operation.asObservable();
}
getoperationsByCategory(): Observable<operation[]> {
    return this.operationByCategory.asObservable();
}
getoperationsByCategoryLimited(): Observable<operation[]> {
    return this.operationByCategoryLimited.asObservable();
}

addNewOperation(data: operation[]){
    return this.database.executeSql(`INSERT INTO 'operations'(category_id, category_name, country_id, currency_type, d_val_1, d_val_2, d_val_3, name, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, data)
    .then(data => {
        this.loadAllOperations()
        return data;

    })
}
    
}
