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
