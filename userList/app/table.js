/**
 *@selector {string}  
 * 
 * @export
 * @class Table
 */
export default class Table {
  constructor(selector, collection) {
    this.tableEl = document.querySelector(selector);
    if (!this.tableEl) throw new Error("Incorrect selector for TABLE element!");
    this.collection = collection;
  }
  add(user) {
    // 1. **Role** — сортируемое, выводятся текстовые названия ролей из
    // объекта, описанного выше
    // 2. **Login** — сортируемое
    // 3. **Full name** — сортируемое, выводится на основе полей last_name
    // и first_name, соединённых пробелом
    // 4. **Age** — сортируемое
    // 5. **Registered on** — сортируемое
    // 6. **Active** — в формате Yes/No
    let regDate = new Date(user.registered_on);
    $(this.tableEl).find('tbody').append(
      `<tr>
          <td>${user.role}</td>
          <td>${user.login}</td>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.age}</td>
          <td>${regDate.getDate()} / ${regDate.getMonth()} / ${regDate.getFullYear()}</td>
          <td>${user.active}</td>
      </tr>`
    );
  }
  sort(field){
    function sorter (item1,item2){
      let param1 = item1[field].toLowerCase();
      let param2 = item2[field].toLowerCase();
      return param1 < param2 ? -1 : (param1 > param2 ? 1 : 0);
    }
    this.collection.sort(sorter);
  }
  update(){
    this.collection.forEach();
    $(this.tableEl).find('tbody').append();
  }
}