module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    replace: {
      example: {
        src: ['dist/jquery.watsi-popup.js'],
        dest: 'dist/jquery.watsi-popup.js',
        replacements: [{ 
          from: 'css/styles.css',
          to: 'https://s3.amazonaws.com/watsi-donate-popup/css/styles.css' 
        }]
      }
    },

    // Concat definitions
    concat: {
      dist: {
        src: ["js/jquery.watsi-popup.js"],
        dest: "dist/jquery.watsi-popup.js"
      }
    },

    // Used to precompile sass files
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'css', // Find SASS in CSS
          src: ['*.sass'],
          dest: 'css', // Drop back into CSS
          ext: '.css'
        }]
      }
    },

    // Minify definitions
    uglify: {
      dist: {
        src: ["dist/jquery.watsi-popup.js"],
        dest: "dist/jquery.watsi-popup.min.js"
      }
    },

    // Used to watch SASS files
    watch: {
      css: {
        files: 'css/*.sass',
        tasks: ['sass']
      }
    },

    // Deploy to S3
    aws: grunt.file.readJSON('./config/aws.json'),
    's3-sync': {
      options: {
          key: '<%= aws.key %>'
        , secret: '<%= aws.secret %>'
        , bucket: '<%= aws.bucket %>'
      },
      s3_popup_cache: {
          files: [
              {
                root: __dirname
                , src:  'js/*.js'
                , dest: 'v1'
              },
              {
                root: __dirname
                , src:  'css/*.css'
                , dest: 'v1'
              },
              {
                root: __dirname
                , src:  '*.html'
                , dest: 'v1'
              },
              {
                root: __dirname
                , src:  'img/*'
                , dest: 'v1'
              }
          ]
      },
    },

  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-s3-sync');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('deploy', ['concat', 'replace', 'uglify', 's3-sync']);

}