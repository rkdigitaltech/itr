import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { FuseNgxDatatableComponent } from './datatable/ngx-datatable.component';

const routes = [
    {
        path     : 'components-third-party/datatables/ngx-datatable',
        component: FuseNgxDatatableComponent
    }
];

@NgModule({
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        FuseNgxDatatableComponent
    ]
})
export class ComponentsThirdPartyModule
{
}
