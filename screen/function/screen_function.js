import ChineseInterator from '../../function/ChineseInterator'

export async function translateFunction(text, toJapanese) {
  let url =
    "https://script.google.com/macros/s/AKfycbyXxnI_Fq939tnxFL9SDX0iz5Wh30WSq7oCRQRsaKcgxOmHHUd7Zq_Rjw/exec" +
    "?" +
    "text=" +
    text;

  if (toJapanese) {
    url = url + "&source=zh-cn" + "&target=ja";
    const japanese = await fetch(url);
    return japanese.json();
  } else {
    url = url + "&source=ja" + "&target=zh-cn";
    const chinese = await fetch(url);
    return chinese.json();
  }
}

export const getData = async (query, userid) => {
  const res = (await new ChineseInterator().fetchLists(query)) ?? [];
  if (!res) {
    return null;
  }
  let ret_item = [];
  if (userid) {
    ret_item = checkIsFavorite(res, userid);
  } else {
    ret_item = setData(res);
  }
  return ret_item;
};

export const checkIsFavorite = async (value, userid) => {
  //make bookmark true if it is bookmarked
  const favoriteItems = await new ChineseInterator().fetchFavorites(userid);

  if (favoriteItems) {
    const bookmarked = [];
    favoriteItems.map((r) => {
      bookmarked.push(r.chinese);
    });
    value.map((v) => {
      if (bookmarked.findIndex((item) => item === v.chinese) >= 0) {
        v.bookmark = true;
      }
    });
  }
  return value;
};

export const getfavorites = async () => {
  // const res = await new ChineseInterator().getAllAsyncStorage();
  const res = await new ChineseInterator().fetchFavorites(userid);
  if (res) {
    res.map((v) => {
      v.bookmark = true;
    });
    setFavorite(res);
  }
};
