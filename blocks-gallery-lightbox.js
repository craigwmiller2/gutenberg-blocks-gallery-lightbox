jQuery(document).ready(function($){

  // If block gallery element exists
  if ( $('.wp-block-gallery').length ) {

    // init empty array to push gallery item data to
    let gallery_items = [];

    // store current active image index
    let index;

    // loop through all gallery items
    $('.wp-block-gallery .blocks-gallery-item').each(function(){

      let image = $('img', this);

      // build object for each image with their id and src
      let image_object = {
        id: image.data('id'),
        src: image.attr('src')
      }

      // push each object to array
      gallery_items.push(image_object);

    });

    // when gallery item is clicked
    $('.blocks-gallery-item').click(function(e){
      
      e.preventDefault();

      // lock body scrolling with class
      $('body').addClass('body-lock');

      // update index to item clicked
      index = $(this).index();

      // add class to body after delay
      setTimeout(function(){
        $('body').addClass('blocks-gallery-lightbox-show');
      }, 100);

      // render lightbox with index
      blocks_gallery_lightbox( index );

    });

    function blocks_gallery_lightbox( index ) {

      // lightbox element
      let lightbox = `
        <div class="blocks-gallery-lightbox fade">
          <button class="lightbox-close">&times;</button>
          <button class="lightbox-arrow lightbox-arrow--prev"><i class="icon-arrow-left"></i></button>
          <button class="lightbox-arrow lightbox-arrow--next"><i class="icon-arrow-right"></i></button>
          <img class="blocks-gallery-lightbox-image" src="${gallery_items[index].src}" alt="" />
        </div>
      `;

      // add to the body
      $('body').prepend(lightbox);

      // remove the fade class to fade in elemtn
      $('body .blocks-gallery-lightbox').removeClass('fade');

    }

    // lightbox navigation
    $('body').on('click', '.lightbox-arrow', function(){

      // renable both arrows
      $('.lightbox-arrow').each(function(){
        $(this).attr('disabled', false);
      });

      if ( $(this).hasClass( 'lightbox-arrow--prev' ) ) {

        // decrement index or set to 0
        index = index > 0 ? index-= 1 : 0;

        // disable prev button if at 0 index
        if ( index === 0 ) {
          $(this).attr('disabled', true);
        }

      } else if ( $(this).hasClass( 'lightbox-arrow--next' ) ) {

        // increment index or set to maximum index (length - 1)
        index = index === gallery_items.length - 1 ? gallery_items.length - 1 : index += 1;

        // disable next button if index is on last
        if ( index === gallery_items.length - 1 ) {
          $(this).attr('disabled', true);
        }

      }

      // update the lightbox with new index
      update_blocks_gallery_lightbox( index );

    });

    function update_blocks_gallery_lightbox( index ) {

      // update the src attribute with new src based on index
      $('.blocks-gallery-lightbox img').attr('src', gallery_items[index].src);

    }

    // call function to close lightbox on X button
    $('body').on('click', '.lightbox-close', close_blocks_gallery_lightbox);

    // detect click on non-img or navigation elements within lightbox
    $('html').click(function(e){

      // if the body has the show class
      // class was added after delay to prevent double triggering on one click when lightbox is first shown
      if ( $('body').hasClass('blocks-gallery-lightbox-show')
          && e.target.className != 'blocks-gallery-lightbox-image'
          && !$(e.target).closest('.lightbox-arrow').length ) {
            // if the target is not the image class and is not a navigation arrow

        // close the lightbox
        close_blocks_gallery_lightbox();
      }
    });

    function close_blocks_gallery_lightbox() {
      // add fade class to fade out
      $('.blocks-gallery-lightbox').addClass('fade');

      // remove the show class from body and the body-lock class to renable scrolling
      $('body').removeClass('blocks-gallery-lightbox-show');
      $('body').removeClass('body-lock');

      setTimeout(function(){
        // after a delay remove the element
        $('.blocks-gallery-lightbox').remove();
      }, 300);
    }

  }

});
