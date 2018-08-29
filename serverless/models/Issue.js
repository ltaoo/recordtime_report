const { getClient, fetch, create } = require('../utils');

class Issue {
  constructor(props) {
    const { id } = props;
    const res = this.fetch(id);
    this.id = res.id;
    this.title = res.title;
  }
  async fetch(id) {
    return await fetch(id);
  }
  async update(params) {
    const id = this.id;
  }
  async remove() {
    const id = this.id;
  }
}

/**
 * 增加 issue
 * @param {number} params.pk - 主键
 */
Issue.create = async (ctx, params) => {
  const client = getClient(ctx);
  return create(client, params);
}

module.exports = Issue;
