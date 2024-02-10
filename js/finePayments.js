"use strict";
/**
Перед вами список полів. Це можна сказати пряме посилання на кожне із полів форми.
Якщо ви додасте до змінної .value (fineNumber.value) то отримаєте значення
яке зберігається в цьому полі.
 */
let fineNumber = document.getElementById("fineNumber");
let passport = document.getElementById("passport");
let creditCardNumber = document.getElementById("creditCardNumber");
let cvv = document.getElementById("cvv");
let amount = document.getElementById("amount");
let buttonSubmit = document.getElementById("payFine");

//Ця зміна містить всі дані які в нас зберігаються у файлі data
let DB = data.finesData;

/**
Вам необхідно реалізувати наступний функціонал.
Зробити валідацію до всіх полів
1. Номер та сума повинні бути однакові як в існуючого штрафу - якщо ні видавати
alert "Номер не співпадає" або "Сума не співпадає"

2. Паспортні дані у форматі - перші дві літери укр алфавіту, та 6 цифр.
Якщо не співпадає то видавати alert "Не вірний паспортний номер"

3. Номер кредитної карки 16 цифр -
якщо не співпадає то видавати alert "Не вірна кредитна картка"

4. cvv 3 цифри - якщо не співпадає то видавати alert "Не вірний cvv".

Якщо валідація проходить успішно, то виконати оплату,
 тобто вам потрібно видалити обєкт з DB
 */
buttonSubmit.addEventListener('click',payFine);
function payFine(){
    const formData = {
        fineNumber: fineNumber.value,
        amount: Number.parseInt(amount.value),
        passport: {
            value: passport.value,
            regex: /^[а-яіїєґ]{2}\d{6}$/i,
            invalidMessage: 'Не вірний паспортний номер',
        },
        creditCardNumber: {
            value: creditCardNumber.value,
            regex: /^(4\d{3}|5[1-5]\d{2})(-| )?(\d{4}(-| )?){2}\d{4}$/,
            invalidMessage: 'Не вірна кредитна картка',
        },
        cvv: {
            value: cvv.value,
            regex: /^\d{3}$/,
            invalidMessage: 'Не вірний cvv',
        },
        invalidMessage: undefined,
        fineIndex: undefined,
        checkExisting() {
            for (let index in DB) {
                if (DB[index]['номер'] === this.fineNumber){
                    this.fineIndex = index
                    return true;
                }
            }
            this.invalidMessage = "Номер не співпадає"
            return false;
        },
        isValid() {
            if (!this.checkExisting()) return false;
            if (DB[this.fineIndex]['сума'] !== this.amount) {
                this.invalidMessage = "Сума не співпадає"
                return false;
            }
            let fieldsArray = [this.passport, this.creditCardNumber, this.cvv]
            for (let field of fieldsArray) {
                if(!field.regex.test(field.value)) {
                    this.invalidMessage = field.invalidMessage
                    return false;
                }
            }
            return true;
        }

    }
    if (formData.isValid()) {
        DB.splice(formData.fineIndex, 1)
        alert("Штраф успішно сплачено")
        resetValues()
        console.log(DB)
    } else {
        alert(formData.invalidMessage)
    }
}

function resetValues() {
    fineNumber.value = "";
    passport.value = "";
    creditCardNumber.value = "";
    cvv.value = "";
    amount.value = "";
}