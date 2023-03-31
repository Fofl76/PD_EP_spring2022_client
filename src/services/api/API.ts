import { ResponceFetchAllMapsList } from "@/interface/api/FetchAllMapsList.interface";
import { ResponceFetchMap } from "@/interface/api/FetchMap.interface";
import { AxiosResponse } from "axios";
import axios from "./axios";

class API {
  async fetchAllMapsList() {
    try {
      const res: AxiosResponse<ResponceFetchAllMapsList[]> = await axios.get("getAllMaps");
      const data = res.data;

      return data
    } catch (e) {
      console.log(e)
    }
  }

  async fetchMap(aupCode: string) {
    try {
      const res: AxiosResponse<ResponceFetchMap> = await axios.get(`map/${aupCode}`)
      const data = res.data
  
      return data
    } catch (e) {
      console.log(e)
    }
  }

  async fetchAllGroups() {
    try {
      const res = await axios.get(`getGroups`)
      const data = res.data
  
      return data
    } catch (e) {
      console.log(e)
    }
  }

  async saveMap(table: any[], aupCode: string) {
    try {
      const activeTableMap = table
  
      const res = await axios.post(`save/${aupCode}`, activeTableMap)
      return res
    } catch (e) {
      console.log(e)
    }
  }

  async addGroup(group: any) {
    try {
      const res = await axios.post(`add-group`, group)
      const data = res.data
      
      return data
    } catch (e) {
      console.log(e);
    }
  }

  async deleteGroup(id: number|string) {
    try {
      const res = await axios.post(`delete-group`, {
        id,
      })
      const data = res.data
      
      return data
    } catch (e) {
      console.log(e)
    }
  }

  async updateGroup(group: any) {
    try {
      const res = await axios.post(`update-group`, group)
      const data = res.data

      return data
    } catch (e) {
      console.log(e)
    }
  }
}

const instance = new API()

export default instance