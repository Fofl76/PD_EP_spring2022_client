import IMapItemValueRaw from "./IMapItemValueRaw";

interface IMapItemRaw {
  discipline: string;
  id: string;
  id_group: number;
  num_col: number;
  num_row: number;
  type: {
    session: IMapItemValueRaw[];
    value: IMapItemValueRaw[];
  };
}

export default IMapItemRaw