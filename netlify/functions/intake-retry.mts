import {retryDeliveries} from './_shared/deliver.mts';
export default async()=>{await retryDeliveries();};
export const config={schedule:'37 * * * *'};
