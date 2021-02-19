import AsyncStorage from "@react-native-async-storage/async-storage";
export default class ChineseInterator {
  url_fetch_list: string;
  url_postFavorite: string;
  url_fetchFavorite: string;
  url_postNote: string;
  url_fetchNote: string;
  url_deleteFavorite: string;
  url_deleteNote: string;

  constructor() {
    this.url_fetch_list =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/sentences";
    this.url_postFavorite =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/sentences";
    this.url_fetchFavorite =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/favorites";
    this.url_postNote =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/sentences";
    this.url_fetchNote =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/favorites";
    this.url_deleteFavorite =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/favorites";
    this.url_deleteNote =
      "https://mlsei45cm3.execute-api.ap-northeast-1.amazonaws.com/dev/favorites";
  }

  public fetchLists = async (query: string): Promise<[] | null> => {
    console.log("fetchingList");
    const url = this.url_fetch_list + "?info=" + query;
    try {
      const res = await fetch(url, { method: "GET" });
      const sentences = await res.json();
      return sentences.Items;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  public postFavorite = async (data: any, userid: string) => {
    const mappeddata = {
      userid: userid,
      chinese: data.chinese,
      japanese: data.japanese,
      pinin: data.pinin,
      type: "favorite",
    };
    console.log("posting favorite");
    try {
      const res = await fetch(this.url_postFavorite, {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(mappeddata),
      });
      if (!res.ok) {
        return null;
      }
      return res;
    } catch (e) {
      console.log("got error", e);
    }
  };

  public postNote = async (data: any, userid: string) => {
    const mappeddata = {
      userid: userid,
      chinese: data.mychinese,
      japanese: data.myjapanese,
      pinin: data.mypinyin,
      type: "note",
    };
    try {
      const res = await fetch(this.url_postNote, {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(mappeddata),
      });
      console.log(res.ok);
      if (!res.ok) {
        return null;
      }
      return await res.json();
    } catch (e) {
      console.log("got error", e);
    }
  };

  public fetchFavorites = async (userid: string) => {
    if (userid) {
      const data = {
        userid: userid,
      };
      console.log("fetchingFavorites");
      const res = await fetch(this.url_fetchFavorite, {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      const sentences = json.Items;
      const ret_arr = sentences.reduce(
        (accumulater: any, currentValue: any) => {
          if (currentValue.type != "note") {
            accumulater.push(currentValue);
          }
          return accumulater;
        },
        []
      );
      return ret_arr;
    }
  };

  // public getAllAsyncStorage = async () => {
  //   try {
  //     const allKeys = await this.getAllKeys();
  //     const ret_arr: any = [];
  //     await allKeys?.map(async (v) => {
  //       const favorite: [] = await this.getAsyncStorageItem(v);
  //       ret_arr.push(favorite);
  //     });
  //     return ret_arr;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // public storeDataToAsyncStorage = async (value: any) => {
  //   try {
  //     const jsonValue = JSON.stringify(value);
  //     await AsyncStorage.setItem(value.japanese, jsonValue);
  //     console.log("OK");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // public removeDataFromAsyncStorage = async (value: string) => {
  //   try {
  //     await AsyncStorage.removeItem(value);
  //   } catch (e) {
  //     // remove error
  //   }
  //   console.log("Done.");
  // };

  // public getAsyncStorageItem = async (value: string) => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem(value);
  //     return jsonValue != null ? JSON.parse(jsonValue) : [];
  //   } catch (e) {
  //     console.log("getAsyncStorageItem error:", e);
  //   }
  // };

  // public getAllKeys = async () => {
  //   try {
  //     const mykeys: string[] = await AsyncStorage.getAllKeys();
  //     return mykeys;
  //   } catch (e) {
  //     // read key error
  //   }
  // };

  // public clearAll = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //   } catch (e) {
  //     // clear error
  //   }

  //   console.log("Done.");
  // };

  public fetchNotes = async (userid: string) => {
    if (userid) {
      const data = {
        userid: userid,
      };
      console.log("fetchingNotes");
      const res = await fetch(this.url_fetchNote, {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      const sentences = json.Items;
      const ret_arr = sentences.reduce(
        (accumulater: any, currentValue: any) => {
          if (currentValue.type === "note") {
            accumulater.push(currentValue);
          }
          return accumulater;
        },
        []
      );
      return ret_arr;
    }
  };

  public deleteFavorite = async (data: { userid: string; chinese: string }) => {
    const res = await fetch(this.url_deleteFavorite, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("deleted");
  };

  public deleteNote = async (data: { userid: string; chinese: string }) => {
    const res = await fetch(this.url_deleteNote, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("deleted");
  };
}
