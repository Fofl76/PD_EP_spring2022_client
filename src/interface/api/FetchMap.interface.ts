import { MapsInterface } from '../Maps.interface'

export interface ResponceFetchMap {
  data: MapsInterface[];
  header: string[];
  year: number;
}