import $ from 'jquery';

const TEMPLATE = `
<div class="input-group">
  <div class="input-group-prepend">
    <button class="btn btn-primary add-rows-button" type="submit">
      Add
    </button>
  </div>
  <input
    type="text"
    class="form-control add-rows-input"
    value="100"
  />
  <div class="input-group-append">
    <span class="input-group-text">more rows at the bottom.</span>
  </div>
</div>
`;

class Footer {
  constructor(root, dataHarmonizer) {
    this.root = $(root);
    this.dh = dataHarmonizer;

    this.root.append(TEMPLATE);

    this.root.find('.add-rows-button').on('click', () => {
      const numRows = this.root.find('.add-rows-input').val();
      this.dh.addRowsToBottom(numRows); 
    });
  }
}

export default Footer;
