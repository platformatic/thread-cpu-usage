#include <napi.h>

using namespace Napi;

#ifdef __linux__
// #include <errno.h>
// #include <pthread.h>
// #include <string.h>
#elif __APPLE__
#include <mach/mach_error.h>
#include <mach/mach_init.h>
#include <mach/thread_act.h>
#elif _WIN32
// #include <Windows.h>
#endif

Value getCpuUsage(Env env, double previousUser, double previousSystem) {
  double user = 0;
  double system = 0;

#ifdef __linux__
#elif __APPLE__
  mach_port_t thread = mach_thread_self();
  mach_msg_type_number_t count = THREAD_BASIC_INFO_COUNT;
  thread_basic_info_data_t usage;
  kern_return_t kr = thread_info(thread, THREAD_BASIC_INFO, (thread_info_t) &usage, &count);

  if (kr != KERN_SUCCESS) {
    throw Error::New(env, "Cannot get thread CPU usage information.");
    return env.Null();
  }

  user = usage.user_time.seconds * 1E6 + usage.user_time.microseconds;
  system = usage.system_time.seconds * 1E6 + usage.system_time.microseconds;
#elif _WIN32
#endif

  // Obtain the reading
  Object obj = Object::New(env);
  obj.Set(String::New(env, "user"), Number::New(env, user - previousUser));
  obj.Set(String::New(env, "system"), Number::New(env, system - previousSystem));

  return obj;
}

Value GetThreadCpuUsage(const CallbackInfo& info) {
  Env env = info.Env();
  double previousUser = 0;
  double previousSystem = 0;

  // Check if it is a new reading or a diff reading
  if (info.Length() > 0 && !info[0].IsUndefined() && !info[0].IsNull()) {
    try {
      Object obj = info[0].As<Object>();
      previousUser = obj.Get("user").As<Number>();
      previousSystem = obj.Get("system").As<Number>();

      if (previousUser < 0 || previousSystem < 0) {
        throw Error::New(env, "Negative values.");
      }
    } catch (...) {
      TypeError::New(
        env,
        "threadCpuUsage only accepts an optional object containing the user and system values as positive numbers.")
        .ThrowAsJavaScriptException();

      return env.Null();
    }
  }

  return getCpuUsage(env, previousUser, previousSystem);
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "threadCpuUsage"), Function::New(env, GetThreadCpuUsage));

  return exports;
}

NODE_API_MODULE(thread_cpu_usage, Init)