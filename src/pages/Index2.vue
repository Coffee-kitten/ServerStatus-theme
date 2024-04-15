<script setup lang="ts">
import { onMounted, ref } from "vue";
import { themeChange } from "theme-change";
import { useIntervalFn } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
onMounted(() => {
  themeChange(false);
});
const theme = localStorage.getItem("theme");
const themeSwap = ref(false);
if (theme === "light") {
  themeSwap.value = false;
} else {
  themeSwap.value = true;
}

import { StatsResp } from "../types/stats.ts";
import {
  formatNetworkSpeed,
  formatSize,
  getDiskPercentage,
  getDiskText,
  getMemoryPercentage,
  getMemoryText,
  getSwapPercentage,
  getSwapText,
  isOnline,
} from "../utils/stats.ts";

const {
  data: stats,
  isLoading,
  error,
  execute: fetchStats,
} = useAxios<StatsResp>(
  "https://server.yyxcv2.top/json/stats.json",
  {
    //
  },
  {
    immediate: false,
  }
);

useIntervalFn(fetchStats, 2000, {
  immediate: true,
  immediateCallback: true,
});
</script>

<template>
  <div class="navbar bg-base-300">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">ServerStatus</a>
      <div class="badge ml-1">
        <p v-if="stats?.updated" class="text-sm">
          Refreshed at {{ new Date(stats?.updated * 1000).toLocaleString() }}
        </p>
        <p v-else="error" class="text-sm text-red-600">
          Last refresh attempt failed with {{ error }}
        </p>
      </div>
    </div>

    <div class="flex-none">
      <label class="flex cursor-pointer gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          />
        </svg>
        <input
          type="checkbox"
          data-toggle-theme="dark,light"
          data-act-class="ACTIVECLASS"
          :checked="themeSwap"
          value="synthwave"
          class="toggle theme-controller"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
      <details class="dropdown dropdown-end ml-5">
        <summary class="btn btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-list w-6 h-6 inline-block"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            ></path>
          </svg>
        </summary>
        <ul
          class="z-10 p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
        >
          <li><a>Stats</a></li>
          <li><a>Details</a></li>
          <li><a>Map</a></li>
          <li><a>One-Click</a></li>
        </ul>
      </details>
    </div>
    <div class="flex-none"></div>
  </div>
  <div class="flex flex-col gap-1" v-if="stats">
    <template v-for="(stat0, index) of stats.servers">
      <details
        v-if="index === 0 || stat0.gid !== stats.servers[index - 1].gid"
        class="collapse collapse-open bg-base-200 rounded-none"
      >
        <summary class="collapse-title text-xl font-medium">
          <span class="badge badge-lg">{{ stat0.gid }}</span>
        </summary>
        <div class="collapse-content">
          <div class="overflow-x-auto">
            <table
              class="table table-zebra table-auto table-pin-rows table-pin-cols"
            >
              <thead>
                <tr>
                  <th>IPV4</th>
                  <th>IPV6</th>
                  <td>Name</td>
                  <td>Location</td>
                  <td>Uptime</td>
                  <td>Load</td>
                  <td>NIC↓|↑</td>
                  <th>Usage↓|↑</th>
                  <th>TCP | UDP</th>
                  <th>CPU</th>
                  <th>RAM</th>
                  <th>Disk</th>
                </tr>
              </thead>
              <tbody v-if="stats">
                <tr v-for="stat of stats.servers" :key="stat.name">
                  <template v-if="stat.gid === stat0.gid">
                    <th>
                      <span style="color: #389e0d" v-if="stat.online4">
                        <svg
                          viewBox="64 64 896 896"
                          focusable="false"
                          data-icon="check-circle"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                          ></path>
                        </svg>
                      </span>
                      <span v-else>
                        <svg
                          viewBox="64 64 896 896"
                          focusable="false"
                          data-icon="warning"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
                          ></path>
                        </svg>
                      </span>
                    </th>
                    <th>
                      <span style="color: #389e0d" v-if="stat.online6">
                        <svg
                          viewBox="64 64 896 896"
                          focusable="false"
                          data-icon="check-circle"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                          ></path>
                        </svg>
                      </span>
                      <span v-else>
                        <svg
                          viewBox="64 64 896 896"
                          focusable="false"
                          data-icon="warning"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zM480 416c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v184c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V416zm32 352a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
                          ></path>
                        </svg>
                      </span>
                    </th>
                    <th>{{ stat.alias }}</th>
                    <th>{{ stat.location }}</th>
                    <th>{{ stat.uptime }}</th>
                    <th>{{ stat.load_1 }}</th>
                    <th>
                      {{ formatNetworkSpeed(stat.network_rx) }} |
                      {{ formatNetworkSpeed(stat.network_tx) }}
                    </th>
                    <th>
                      {{ formatSize(stat.network_in) }} |
                      {{ formatSize(stat.network_out) }}
                    </th>
                    <th>{{ stat.tcp_count }} | {{ stat.udp_count }}</th>
                    <th>
                      <div
                        class="tooltip tooltip-left"
                        :data-tip="
                          stat.process_count +
                          'Processes / ' +
                          stat.thread_count +
                          'Threads'
                        "
                      >
                        <progress
                          class="progress progress-success w-12"
                          :value="stat.cpu"
                          max="100"
                        ></progress>
                      </div>
                    </th>
                    <th>
                      <div class="tooltip tooltip-left" :data-tip="getMemoryText(stat)">
                        <progress
                          class="progress progress-success w-12"
                          :value="getMemoryPercentage(stat)"
                          max="100"
                        ></progress>
                      </div>
                    </th>
                    <th>
                      <div class="tooltip tooltip-left" :data-tip="getDiskText(stat)">
                        <progress
                          class="progress progress-success w-12"
                          :value="getDiskPercentage(stat)"
                          max="100"
                        ></progress>
                      </div>
                    </th>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </template>
  </div>
  <span v-else class="loading loading-spinner loading-xs"></span>

  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <aside>
      <p class="mb-2 text-xs"> OnePixel's Cloud Status </p>
      <p>
        <span class="inline-block"
          >Powered by
          <a
            class="underline underline-offset-2"
            href="https://github.com/zdz/ServerStatus-Rust"
            target="_blank"
            ref="noreferer"
            >ServerStatus-Rust</a
          ></span
        ><span
          class="inline-block text-gray-400 dark:text-gray-500 mx-2"
          aria-hidden="true"
          >|</span
        >
        <a
          class="inline-block underline underline-offset-2"
          href="https://github.com/Coffee-kitten/ServerStatus-theme"
          target="_blank"
          rel="noreferrer"
          >Theme</a
        >
      </p>
    </aside>
  </footer>
</template>
