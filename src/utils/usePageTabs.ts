import { defineStore } from "pinia";
import { ref } from "vue";
import type { PageTabsItem } from "@/types";

export const usePageTabs = defineStore("pageTabs", () => {
  const _tabsID = new Set();
  const tabs = ref<PageTabsItem[]>([]);

  // 标签页是否存在
  const has = (tab_key: number) => {
    return _tabsID.has(tab_key);
  };

  // 追加标签页到列表末尾
  const push = (tab: PageTabsItem) => {
    if (has(tab.key)) return;

    _tabsID.add(tab.key);
    tabs.value!.push(tab);
  };

  // 删除标签页
  const close = (tab_key: number) => {
    const tabIndex = tabs.value.findIndex((tab) => tab.key === tab_key);

    if (tabIndex === -1) return;

    _tabsID.delete(tab_key);
    tabs.value.splice(tabIndex, 1);
  };

  return { tabs, push, close };
});
