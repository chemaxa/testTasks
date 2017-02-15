/**
 * @selector {string}
 * @collectio {collection}
 * @export
 * @class Table
  1. **Role** — сортируемое, выводятся текстовые названия ролей из  объекта, описанного выше
  2. **Login** — сортируемое
  3. **Full name** — сортируемое, выводится на основе полей last_name
  и first_name, соединённых пробелом
  4. **Age** — сортируемое
  5. **Registered on** — сортируемое
  6. **Active** — в формате Yes/No
  Roles: {1: ‘Administrator’, 2: ‘Technician’, 3:‘Manager’, 4: ‘Supervisor’}
 */
export default class Table {
  constructor(selector, collection) {
    this.tableEl = document.querySelector(selector);
    if (!this.tableEl) throw new Error("Incorrect selector for TABLE element!");
    this.handler = this.handler.bind(this);
    this.tableEl.addEventListener('click', this.handler, false);
    this.sortOrder = 'ASC';
    this.collection = collection;
  }

  add(user) {
    let regDate = new Date(user.registered_on);
    
    let role = this.getUserRoleName(user.role);

    $(this.tableEl).find('tbody').append(
      `<tr data-id=${user.login}>
          <td>${role}</td>
          <td>${user.login}</td>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.age}</td>
          <td>${regDate.getDate()} / ${regDate.getMonth()} / ${regDate.getFullYear()}</td>
          <td>${user.active}</td>
      </tr>`
    );
  }

  init(list = this.collection['_elems']) {
    $(this.tableEl).find('tbody').empty();
    this.collection.forEach((user) => {
      let role = this.getUserRoleName(user.role);

      let regDate = new Date(user.registered_on);
      $(this.tableEl).find('tbody').append(
        `<tr data-id=${user.login}>
            <td>${role}</td>
            <td>${user.login}</td>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.age}</td>
            <td>${regDate.getDate()} / ${regDate.getMonth()} / ${regDate.getFullYear()}</td>
            <td>${user.active}</td>
        </tr>`
      );
    }, list);
  }

  handler(event) {
    if (!event.target.dataset.appSort) return;
    let sortField = event.target.dataset.appSort;
    console.log(sortField);
    this.sort(sortField, this.sortOrder);
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
  }

  sort(field, order) {
    let self = this;
    function sorter(item1, item2) {
      let param1, param2;
      item1[field] = typeof item1[field] == 'string' ? item1[field].toLowerCase() : item1[field];
      item2[field] = typeof item2[field] == 'string' ? item2[field].toLowerCase() : item2[field];
      if (order === 'ASC') {
        param1 = item1[field];
        param2 = item2[field];
      } else {
        param2 = item1[field];
        param1 = item2[field];
      }
      if (field === 'role') {
        param1 = self.getUserRoleName(param1);
        param2 = self.getUserRoleName(param2);
      }
      return param1 < param2 ? -1 : (param1 > param2 ? 1 : 0);
    }

    let sorted = this.collection.sort(sorter);
    console.info('Collection: ', this.collection._elems);
    console.info('Sorted: ', sorted);
    this.init(sorted);
  }

  getUserRoleName(indx) {
    let role;
    switch (indx) {
      case 1:
        role = 'Administrator';
        break;
      case 2:
        role = 'Technician';
        break;
      case 3:
        role = 'Manager';
        break;
      case 4:
        role = 'Supervisor';
        break;
      default:
        role = 'Anonimus';
    }
    return role;
  }

  update(user) {
    let regDate = new Date(user.registered_on);
    let role;
    switch (user.role) {
      case 1:
        role = 'Administrator';
        break;
      case 2:
        role = 'Technician';
        break;
      case 3:
        role = 'Manager';
        break;
      case 4:
        role = 'Supervisor';
        break;
    }
    $(this.tableEl).find(`tbody tr[data-id=${user.login}]`).replaceWith(
      `<tr data-id=${user.login}>
          <td>${role}</td>
          <td>${user.login}</td>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.age}</td>
          <td>${regDate.getDate()} / ${regDate.getMonth()} / ${regDate.getFullYear()}</td>
          <td>${user.active}</td>
      </tr>`);
  }
}