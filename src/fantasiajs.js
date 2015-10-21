/*
 *
 *
 *
 * Copyright (c) 2015 Emil Rune Møller
 * Licensed under the MIT license.
 */
(function ( $ ) {

   $.fn.fantasia = function( options ) {

      var vm = this;

       var settings = $.extend({
           trackFrom : 'body',
           perspectiveParent : null,
           perspective : '600px',
           rotationLimit : '20',
           type : '3d',
           scaleDepths : true,
           depthValue : 50,
           magicNumber : 5
       }, options );


       vm.elem = $(this);
       vm.perspectiveContainer = $(settings.perspectiveParent);
       vm.trackingSelector = $(settings.trackFrom);
       vm.boxWidth = vm.trackingSelector.width();
       vm.boxHeight = vm.trackingSelector.height();

       if (settings.perspectiveParent === null) {
          vm.perspectiveContainer = $(settings.trackFrom);
       } else {
          vm.perspectiveContainer = $(settings.perspectiveParent);
       }

       switch (settings.trackFrom) {
        case window :
          vm.boxTop = 0;
          vm.boxLeft = 0;
          break;
        default :
          vm.boxTop = vm.trackingSelector.offset().top;
          vm.boxLeft = vm.trackingSelector.offset().left;
       }

       vm.boxX0 = vm.boxLeft;
       vm.boxX1 = vm.boxLeft + (vm.boxWidth / 2);
       vm.boxX2 = vm.boxLeft + vm.boxWidth;

       vm.boxY0 = vm.boxTop;
       vm.boxY1 = vm.boxTop + (vm.boxHeight / 2);
       vm.boxY2 = vm.boxTop + vm.boxHeight;

       vm.minValue = -settings.rotationLimit;
       vm.maxValue = settings.rotationLimit;

       vm.oldRangeX = (vm.boxX2 - vm.boxX0);
       vm.newRangeX = (vm.maxValue - vm.minValue);

       vm.oldRangeY = (vm.boxY2 - vm.boxY0);
       vm.newRangeY = (vm.maxValue - vm.minValue);

       vm.minShadowValue = -1;
       vm.maxShadowValue = 1;
       vm.shadowRange = (vm.maxShadowValue - vm.minShadowValue);
       vm.shadowDepthFactor = 1.5;

       vm.orientationX = vm.boxX1;
       vm.orientationY = vm.boxY1;

       vm.mouseX = vm.orientationX;
       vm.mouseY = vm.orientationY;

       vm.depths = vm.elem.find('[data-depth]');


       // Kick off perspective
       vm.perspectiveContainer.css('perspective', settings.perspective);


       vm.trackingSelector.on('mousemove', function(e) {
         vm.mouseX = e.pageX;
         vm.mouseY = e.pageY;
       });


       function rotate() {
         vm.orientationX += (vm.mouseX - vm.orientationX) / settings.magicNumber;
         vm.orientationY += (vm.mouseY - vm.orientationY) / settings.magicNumber;

         vm.rotateY = (((vm.orientationX - vm.boxX0) * vm.newRangeX) / vm.oldRangeX) + vm.minValue;
         vm.rotateX = (((vm.orientationY - vm.boxY0) * vm.newRangeY) / vm.oldRangeY) + vm.minValue;
         vm.shadowX = Math.abs((((vm.orientationX - vm.boxX0) * vm.shadowRange) / vm.oldRangeX) + vm.minShadowValue);
         vm.shadowY = Math.abs((((vm.orientationY - vm.boxY0) * vm.shadowRange) / vm.oldRangeY) + vm.minShadowValue);
         vm.shadow = (vm.shadowX + vm.shadowY) / 2;


         switch (settings.type) {

            case '3d' :
              vm.elem.css({
              'transform': 'rotateX(' + vm.rotateX + 'deg) rotateY('+ -vm.rotateY + 'deg)'
              });

              vm.elem.find('.shadow').css({
                'opacity': vm.shadow
              });

         }


         vm.depths.each(function() {
           var layer = $(this);
           var depth = $(this).data('depth');
           var translateZ = depth * settings.depthValue;
           if ( $(this).data('scale') === false) {
            translateZ = 0;
           }
           var depthShadow = (vm.shadow / depth) * vm.shadowDepthFactor;


           if (depthShadow < 0) {
             depthShadow = depthShadow * depth;
           }


           switch (settings.type) {

            case '3d'  :
              layer.css({
                'z-index': depth,
                'transform': 'translate3d('+ 0  +'px,'+ 0 +'px,'+ translateZ +'px)'
              });

              layer.find('.shadow').css({
                'opacity': Math.abs(depthShadow)
              });

              if (!settings.scaleDepths) {
                layer.css({
                  'z-index': depth,
                  'transform': 'translate3d(0,0,0)'
                });

                layer.find('.shadow').css({
                  'opacity': vm.shadow
                });
              }
              break;

            default :
              layer.css({
                 'z-index': depth,
                'transform': 'translate3d('+ (-vm.rotateY * depth)  +'px,'+ (-vm.rotateX * depth) +'px,'+ translateZ +'px)'
              });

              if (!settings.scaleDepths) {
                layer.css({
                  'z-index': depth,
                  'transform': 'translate3d('+ (-vm.rotateY * depth)  +'px,'+ (-vm.rotateX * depth) +'px, 0px)'
                });
              }

            }
            // Switch end

         });

         window.requestAnimationFrame(rotate);
       }

       window.requestAnimationFrame(rotate);

   };
}( jQuery ));
