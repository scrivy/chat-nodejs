module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['public/js/*.js']
    },
    watch: {
      files: [
        'Gruntfile.js',
        'public/js/*.js',
        'public/index.html',
        'public/partials/*.html',
        'public/css/*'
      ],
      options: {
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
