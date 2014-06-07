module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['public/js/*.js']
    },
    watch: {
      files: [
        'public/js/*.js',
        'public/index.html'
      ],
      options: {
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
