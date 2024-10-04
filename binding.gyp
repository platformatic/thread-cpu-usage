{
  'targets': [
    {
      'target_name': 'thread-cpu-usage-native',
      'sources': [ 'src/thread-cpu-usage.cc' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
      'dependencies': ["<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ]      
    }
  ]
}