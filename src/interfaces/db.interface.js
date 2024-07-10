// Abstraction (interface)
export class DBInterface {
  async create(id, data) {
    throw new Error("Not implemented");
  }

  async add(data) {
    throw new Error("Not implemented");
  }

  async get(id) {
    throw new Error("Not implemented");
  }

  //  realtime updates
  getSubscribe(q) {
    throw new Error("Not implemented");
  }

  getCollection(q) {
    throw new Error("Not implemented");
  }

  async update(id, date) {
    throw new Error("Not implemented");
  }

  async delete(data) {
    throw new Error("Not implemented");
  }

  async count(q) {
    throw new Error("Not implemented");
  }

  //  realtime updates
  countSubscribe(q) {
    throw new Error("Not implemented");
  }

  async unsubscribeAll() {
    throw new Error("Not implemented");
  }
}
