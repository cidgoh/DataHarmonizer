import $ from 'jquery';
import { renderContent } from './utils/content';
import './HelpSidebar.css';

const DEFAULT_OPTIONS = {
  width: 300,
  toggleTransitionDuration: 300,
  onToggle: null,
  title: 'Column Help',
  placeholder: 'Select a cell to get help for that column.',
  closedToggleLabel: '?',
  openedToggleLabel: '&times;',
};

class HelpSidebar {
  constructor(root, options) {
    this.root = $(root);
    this.isOpen = false;

    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    if (this.options.openedToggleLabel == null) {
      this.options.openedToggleLabel = this.options.closedToggleLabel;
    }

    this._init();
  }

  _getWidth() {
    return this.isOpen ? 0 : this.options.width;
  }

  _getTogglerLabel() {
    return this.isOpen
      ? this.options.openedToggleLabel
      : this.options.closedToggleLabel;
  }

  _setOpen(isOpen) {
    this.isOpen = isOpen;
    this.sidebar.css('right', -this._getWidth());
    this.root.css('padding-right', this.options.width - this._getWidth());
    this.toggler.toggleClass('open', this.isOpen).html(this._getTogglerLabel());
    if (typeof this.options.onToggle === 'function') {
      setTimeout(
        () => this.options.onToggle(this.isOpen),
        this.options.toggleTransitionDuration
      );
    }
  }

  _handleTogglerClick(event) {
    event.preventDefault();
    this.toggle();
  }

  _init() {
    this.root.css({
      position: 'relative',
      overflow: 'hidden',
    });

    this.sidebar = $(`<div class="help-sidebar"></div>`)
      .css({
        width: this.options.width,
        right: -this._getWidth(),
        'transition-duration': this.options.toggleTransitionDuration + 'ms',
      })
      .appendTo(this.root);

    this.content = $(
      `<div class="help-sidebar__content">
        <h4 class="help-sidebar__title" data-i18n="help-sidebar__title">${this.options.title}</h4>
      </div>`
    ).appendTo(this.sidebar);

    this.contentInner = $(
      `<div class="help-sidebar__content-inner">
        <p class="help-sidebar__placeholder" data-i18n="help-sidebar__placeholder">
          ${this.options.placeholder}
        </p>
      </div>`
    ).appendTo(this.content);

    this.toggler = $(
      `<button class="help-sidebar__toggler">${this._getTogglerLabel()}</button>`
    ).appendTo(this.sidebar);

    this.toggler.on('click', this._handleTogglerClick.bind(this));
  }

  setContent(content) {
    // Convert Markdown content to sanitized HTML
    const renderedHtml = renderContent(content);

    // Update the contentInner with rendered HTML
    this.contentInner.html(renderedHtml);

    // Process each paragraph
    this.contentInner.children('p').each((_, element) => {
      // Find all 'strong' tags within the current paragraph
      $(element)
        .find('strong')
        .each((_, strongElement) => {
          // Get the inner text of the strong element, convert to lowercase, and make it a reference
          const reference = $(strongElement)
            .text()
            .toLowerCase()
            .replace(/\s+/g, '-');
          // Set the data-i18n attribute with the formatted reference
          $(strongElement).attr('data-i18n', `help-sidebar__${reference}`);
        });

      // Ensure all links within the paragraph are anchored by default
      $(element).find('a').attr('target', '_blank');
    });

    $(document).localize();
  }

  toggle() {
    this._setOpen(!this.isOpen);
  }

  open() {
    this._setOpen(true);
  }

  close() {
    this._setOpen(false);
  }
}

export default HelpSidebar;
