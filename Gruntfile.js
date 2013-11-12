module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    
    // Used to watch SASS files
    watch: {
      css: {
        files: 'css/*.sass',
        tasks: ['sass']
      }
    },

    aws: grunt.file.readJSON('./config/aws.json'),
    'deploy': {
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
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-s3-sync');
  grunt.registerTask('default', ['watch']);
}