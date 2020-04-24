import { observable, action } from 'mobx';

class User {
  @observable name = 'zhang san';

  @action setName = (_name: string) => {
    this.name = _name;
  };
}

export const user = new User();

export default { user };
