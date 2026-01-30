'use strict';

const scrollHelper = {
  /**
   * scrollHandler: per verificare se ho scrollato oltre l'header (o una certa altezza),
   * e se sto scrollando UP o DOWN
   * gestendo classi sul body di conseguenza
   * @param: h
   *
   * Per attivarla:


   * */
  scrollPos: 0,
  directionHandler: function() {
    /**
     * add class scrolling-down / up to body
     * ->
     * window.addEventListener('scroll',(e)=>{
     *   scrollHelper.directionHandler();
     * }, {passive: true});
     * */
    if (document.body.getBoundingClientRect().top > this.scrollPos) {
      document.documentElement.setAttribute('data-scrolldirection', 'up');
    } else {
      document.documentElement.setAttribute('data-scrolldirection', 'down');
      if (document.body.getBoundingClientRect().top != 0) {
        document.documentElement.setAttribute('data-scrollposition', '');
      }
    }
    //if (window.scrollY === 0) {
    if (window.scrollY < 10) {
      document.documentElement.setAttribute('data-scrollposition', 'top');
    }
    // saves the new position for iteration.
    this.scrollPos = document.body.getBoundingClientRect().top;
  }
};
export default scrollHelper;
