module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      main: ['build/*', 'build-release/*'],
      release: ['*.zip', 'build-release/*']
    },
    webpack: {
      build: {
        entry: {
          popup: './app/javascripts/popup.js',
          tabWatcher: './app/javascripts/tabWatcher.js',
          welcome: './app/javascripts/welcome.js'
        },
        output: {
          path: './build/javascripts/',
          filename: '[name].js'
        },
        externals: {
          jquery:       'window.jQuery.noConflict(true)',
          handlebars:   'window.Handlebars',
          templates:    'window.Handlebars.templates'
        }
      }
    },
    copy: {
      build: {
        files: [{
          expand: true,
          flatten: false,
          cwd: 'app/',
          src: ['_locales/**/*', 'manifest.json', 'images/icons/*', 'images/pages/**/*', '*.html'],
          dest: 'build/'
        }]
      },
      release: {
        files: [{
          expand: true,
          flatten: false,
          cwd: 'build/',
          src: ['**'],
          dest: 'build-release/'
        }]
      },
      ziprelease: {
        files: [{
          expand: true,
          flatten: false,
          src: ['*.zip'],
          dest: 'releases/'
        }]
      },
      jsons: {
        files: [{
          expand: true,
          flatten: false,
          cwd: 'app/',
          src: ['**/*.json'],
          dest: 'build/'
        }]
      },
      images: {
        files: [{
          expand: true,
          flatten: false,
          cwd: 'app/',
          src: ['images/icons/*', 'images/pages/**/*'],
          dest: 'build/'
        }]
      },
      htmls: {
        files: [{
          expand: true,
          flatten: false,
          cwd: 'app/',
          src: ['*.html'],
          dest: 'build/'
        }]
      }
    },
    jshint: {
      all: {
        src: ['Gruntfile.js', 'app/manifest.json', 'app/**(?!vendor)/*.js', '_locales/**/*.json']
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      all: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: 'javascripts/**/*.js',
          dest: 'build-release/'
        },{
          expand: true,
          cwd: 'build/',
          src: 'javascripts/templates.js',
          dest: 'build-release/'
        },{
          expand: true,
          cwd: 'build/',
          src: 'vendor/**/*.js',
          dest: 'build-release'
        }]
      }
    },
    handlebars: {
      compile: {
        files: {
          'build/javascripts/compiled.templates.js': 'app/templates/**/*.handlebars'
        },
        options: {
          namespace: 'Handlebars.templates',
          processName: function(filePath) {
            var templateName = filePath.match(/\/(\w*)\./)[1];
            return templateName;
          },
          compilerOptions: {
            knownHelpers: {
              "t": true,
              "enabledSetting": true
            }
          }
        }
      }
    },
    sass: {
      build: {
        options: {
          style: 'expanded',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'app/stylesheets',
          src: ['*.scss'],
          dest: 'build/stylesheets',
          ext: '.css'
        }]
      },
      release: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'app/stylesheets',
          src: ['*.scss'],
          dest: 'build-release/stylesheets',
          ext: '.css'
        }]
      }
    },
    concat: {
      vendor: {
        stripBanners: true,
        src: ['app/vendor/javascripts/handlebars.js', 'app/vendor/javascripts/jquery.js'],
        dest: 'build/vendor/javascripts/vendor.js'
      }
    },
    watch: {
      javascripts: {
        files: ['app/**/*.js'],
        tasks: ['jshint', 'copy:build:files', 'webpack:build']
      },
      templates: {
        files: ['app/templates/*.handlebars'],
        tasks: ['handlebars']
      },
      stylesheets: {
        files: ['app/stylesheets/*.scss'],
        tasks: ['sass']
      },
      jsons: {
        files: ['app/**/*.json'],
        tasks: ['jshint', 'copy:jsons']
      },
      images: {
        files: ['app/images/**'],
        tasks: ['copy:images']
      },
      htmls: {
        files: ['app/*.html'],
        tasks: ['copy:htmls']
      }
    },
    bump: {
      options: {
        files: ['app/manifest.json','package.json'],
        commit: false,
        createTag: false,
        push: false
      }
    },
    compress: {
      main: {
        options: {
          archive: '<%= pkg.name %>-v<%= grunt.file.readJSON("app/manifest.json").version %>.zip',
          mode: 'zip',
        },
        expand: true,
        cwd: 'build-release/',
        src: ['**']
      }
    },
    changelog: {
      main: {
        options: {
          dest: 'CHANGELOG.md',
          featureRegex: /^(.*)(add)(.*)$/gim,
          fixRegex: /^(.*)(fix)(.*)$/gim,
          insertType: 'prepend',
          template: '### v{{> version}} ({{date}})\n\n{{> features}}',
          logArguments: [
          '--pretty=%h %s'
          ],
          partials: {
            version: '<%= grunt.file.readJSON("app/manifest.json").version %>',
            features: '{{#if features}}{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}',
            feature: '* [NEW] {{this}}\n',
            fixes: '{{#each fixes}}{{> fix}}{{/each}}',
            fix: '* [FIX] {{this}}\n',
            empty: '* There were no changes'
          }
        }
      }
    }
  });

  grunt.registerTask('build', [
    'clean',
    'jshint',
    'handlebars',
    'copy:build',
    'webpack:build',
    'sass:build',
    'concat'
  ]);

  grunt.registerTask('release', function(type) {
    if (type !== 'dryrun') {
      grunt.task.run('bump:' + type);
      grunt.task.run('build');
      grunt.task.run('copy:release');
      grunt.task.run('sass:release');
      grunt.task.run('uglify');
      grunt.task.run('compress');
      grunt.task.run('copy:ziprelease');
      grunt.task.run('clean:release');
      grunt.task.run('changelog');
    } else {
      grunt.task.run('build');
      grunt.task.run('copy:release');
      grunt.task.run('sass:release');
      grunt.task.run('uglify');
      grunt.task.run('compress');
    }
  });

  grunt.registerTask('default', [
    'build',
    'watch'
  ]);
};

