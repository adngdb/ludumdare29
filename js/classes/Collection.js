// Define the collection class.
App.Collection = (function(){

    // I am the constructor function.
    function Collection(){

        // When creating the collection, we are going to work off
        // the core array. In order to maintain all of the native
        // array features, we need to build off a native array.
        var collection = Object.create( Array.prototype );

        // Initialize the array. This line is more complicated than
        // it needs to be, but I'm trying to keep the approach
        // generic for learning purposes.
        collection = (Array.apply( collection, arguments ) || collection);

        // Add all the class methods to the collection.
        Collection.injectClassMethods( collection );

        // Return the new collection object.
        return( collection );

    }


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Define the static methods.
    Collection.injectClassMethods = function( collection ){

        // Loop over all the prototype methods and add them
        // to the new collection.
        for (var method in Collection.prototype){

            // Make sure this is a local method.
            if (Collection.prototype.hasOwnProperty( method )){

                // Add the method to the collection.
                collection[ method ] = Collection.prototype[ method ];

            }

        }

        // Return the updated collection.
        return( collection );

    };


    // I create a new collection from the given array.
    Collection.fromArray = function( array ){

        // Create a new collection.
        var collection = Collection.apply( null, array );

        // Return the new collection.
        return( collection );

    };

    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Define the class methods.
    Collection.prototype = {

        // I add the given item to the collection. If the given item
        // is an array, then each item within the array is added
        // individually.
        add: function( value ){

            // Check to see if the item is an array.
            if (Array.isArray( value )){

                // Add each item in the array.
                for (var i = 0 ; i < value.length ; i++){

                    // Add the sub-item using default push() method.
                    Array.prototype.push.call( this, value[ i ] );

                }

            } else {

                // Use the default push() method.
                Array.prototype.push.call( this, value );

            }

            // Return this object reference for method chaining.
            return( this );

        },


        // I add all the given items to the collection.
        addAll: function(){

            // Loop over all the arguments to add them to the
            // collection individually.
            for (var i = 0 ; i < arguments.length ; i++){

                // Add the given value.
                this.add( arguments[ i ] );

            }

            // Return this object reference for method chaining.
            return( this );

        },

        getFirstDead: function () {
            for (var i = 0, ln = this.length; i < ln; i++) {
                if (!this[i].exists) {
                    return this[i];
                }
            }
            return null;
        }

    };


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //
    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Return the collection constructor.
    return( Collection );


}).call( {} );
