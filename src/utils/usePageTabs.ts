import { defineStore } from "pinia";
import { ref } from "vue";
import type { PageTabsItem } from "@/types";
import router from "@/router";

const defaultTab: PageTabsItem = {
  id: 1,
  label: '首页',
  path: '/'
}

export const usePageTabs = defineStore("pageTabs", () => {
  const _tabsID = new Set<number>();
  const tabs = ref<PageTabsItem[]>([]);
  const current = ref<number>()

  const _go = (path: string) => {
    router.replace(path)
  }

  // 标签页是否存在
  const has = (tab_key: number) => {
    return _tabsID.has(tab_key);
  };

  // 追加标签页到列表末尾
  const push = (tab: PageTabsItem) => {
    if (has(tab.id)) return;

    _tabsID.add(tab.id);
    tabs.value!.push(tab);
  };

  // 切换到另一个标签页，并更新状态
  const to = (path: string) => {
    _go(path)
  }

  // 删除标签页
  const close = (tab_id: number) => {
    console.log(tab_id);
    const tabIndex = tabs.value.findIndex((tab) => tab.id === tab_id);

    if (tabIndex === -1) return;

    _tabsID.delete(tab_id);
    tabs.value.splice(tabIndex, 1);

    if (tabs.value.length === 0) {
      current.value = defaultTab.id
      _go(defaultTab.path);
    }
  };

  const init = () => {
    current.value = defaultTab.id
  }

  return { tabs, current, push, to, close, init };
});
