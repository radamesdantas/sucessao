// =============================================================
// Google Apps Script — Backend para Jornada Protagonista
// =============================================================
//
// COMO CONFIGURAR:
//
// 1. Acesse https://sheets.google.com e crie uma planilha nova
// 2. Renomeie a primeira aba para "storage" (importante!)
// 3. Na celula A1 escreva "key" e na B1 escreva "value"
// 4. Va em Extensoes > Apps Script
// 5. Apague o conteudo e cole TODO este arquivo
// 6. Clique em "Implantar" > "Nova implantacao"
//    - Tipo: "App da Web"
//    - Executar como: "Eu"
//    - Quem pode acessar: "Qualquer pessoa"
// 7. Clique em "Implantar" e copie a URL gerada
// 8. Cole a URL no arquivo .env.local do projeto:
//    NEXT_PUBLIC_SHEETS_API_URL=https://script.google.com/macros/s/SEU_ID/exec
//
// =============================================================

function getStorageSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('storage');
  if (!sheet) {
    sheet = ss.insertSheet('storage');
    sheet.getRange(1, 1).setValue('key');
    sheet.getRange(1, 2).setValue('value');
  }
  return sheet;
}

function getValue(sheet, key) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      try {
        return JSON.parse(data[i][1]);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

function setValue(sheet, key, value) {
  var data = sheet.getDataRange().getValues();
  var jsonValue = JSON.stringify(value);
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(jsonValue);
      return;
    }
  }
  sheet.appendRow([key, jsonValue]);
}

function deleteKey(sheet, key) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = getStorageSheet();
  var key = e.parameter.key;

  if (!key) {
    return jsonResponse({ error: 'key parameter required' });
  }

  var value = getValue(sheet, key);
  return jsonResponse(value);
}

function doPost(e) {
  var sheet = getStorageSheet();
  var payload = JSON.parse(e.postData.contents);

  if (payload.action === 'delete') {
    deleteKey(sheet, payload.key);
    return jsonResponse({ success: true });
  }

  setValue(sheet, payload.key, payload.value);
  return jsonResponse({ success: true });
}
