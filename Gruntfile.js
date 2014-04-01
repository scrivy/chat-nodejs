module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      client: {
        src: ['client/chat-client-src.js'],
        dest: 'public/js/chat-client.js'
      }
    },
    watch: {
      files: ['<%= browserify.client.src %>'],
      tasks: ['browserify']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify']);
};
