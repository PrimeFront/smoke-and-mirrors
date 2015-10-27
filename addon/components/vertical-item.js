import PreRenderStateMapMixin from '../mixins/prerender-state-map';
import layout from '../templates/components/vertical-item';
import LinkedComponentMixin from '../mixins/linked-component-list';
import PrerenderComponent from './pre-render';

/**
 A vertical-item is one that intelligently removes
 its content when scrolled off the screen vertically.
 **/
export default PrerenderComponent.extend(LinkedComponentMixin, PreRenderStateMapMixin, {
  layout: layout,
  tagName: 'vertical-item',
  itemTagName: 'vertical-item',

  heightProperty: 'minHeight',
  alwaysUseDefaultHeight: false,

  attributeBindings: ['viewState'],
  classNames: ['vertical-item'],
  collection: null,

  defaultHeight: 75,
  index: null,

  radar: null,
  satellite: null,
  registerSatellite(satellite) {
    this.satellite = satellite;
  },
  unregisterSatellite() {
    this.satellite = null;
  },

  _height: 0,

  didInsertElement() {
    this._super();
    this.get('radar').register(this);
  },

  didPreRender(dimensions) {
    this.dimensions = dimensions;
  },

  willInsertElement() {
    this._super();
    /*
    let _height = this.get('_height');
    let heightProp = this.get('heightProperty');
    let defaultHeight = this.get('defaultHeight');
    if (typeof defaultHeight === 'number') {
      defaultHeight += 'px';
    }

    this.element.style.visibility = 'hidden';
    this.element.style[heightProp] = _height ? _height + 'px' : defaultHeight;
    */
  },

  willDestroyElement() {
    this._super();
    this.setProperties({
      viewState: 'culled',
      contentCulled: true,
      contentHidden: false,
      contentInserted: false });
    this.get('radar').unregister(this);
  },

  willDestroy() {
    this._super();
    this.collection.unregister(this);
  },

  init() {
    this._super(...arguments);

    let tag = this.get('itemTagName');
    this.set('tagName', tag);
    tag = tag.toLowerCase();

    let isTableChild = tag === 'tr' || tag === 'td' || tag === 'th';
    // table children don't respect min-height :'(
    this.heightProperty = isTableChild || this.alwaysUseDefaultHeight ? 'height' : 'minHeight';
    this.collection.register(this);
  }

});
