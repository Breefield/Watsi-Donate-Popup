module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    watch: {
      css: {
        files: '**/*.sass',
        tasks: ['sass']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
}