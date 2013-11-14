module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Banner definitions
    meta: {
      banner: "/*\n" +
        " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
        " *  <%= pkg.description %>\n" +
        " *  <%= pkg.homepage %>\n" +
        " *\n" +
        " *  Made by <%= pkg.author.name %>\n" +
        " *  Under <%= pkg.licenses[0].type %> License\n" +
        " */\n"
    },

    // Concat definitions
    concat: {
      dist: {
        src: ["js/jquery.watsi-popup.js"],
        dest: "dist/jquery.watsi-popup.js"
      },
      options: {
        banner: "<%= meta.banner %>"
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
      },
      options: {
        banner: "<%= meta.banner %>"
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
  grunt.loadNpmTasks('grunt-s3-sync');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('deploy', ['concat', 'uglify', 's3-sync']);

}