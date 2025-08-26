import { Button, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";

const styles = {
  header: {
    backgroundColor: "#900020",
    color: "white",
    padding: "10px 15px",
    textAlign: "center",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  title: {
    margin: 0,
    fontSize: "1rem",
  },
};

const tabs = [
  { id: "wine", label: "와인" },
  { id: "yangju", label: "양주" },
];

const ChatHeader = () => {
  const [selectedTab, setSelectedTab] = useState("wine");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("selectedCate");
      if (storedTab) {
        setSelectedTab(storedTab);
      }
    }
  }, []);

  const handleTabChange = (id) => {
    setSelectedTab(id);
    localStorage.setItem("selectedCate", id);
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("chat_messages");
    }
    window.location.reload();
  };

  return (
    <div style={styles.header} className="flex justify-between items-center">
      <h2 style={styles.title}>🍷 DLink</h2>
      {/* <Tabs
        items={tabs}
        aria-label="tabs"
        radius="sm"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
      >
        {(item) => <Tab key={item.id} title={item.label}></Tab>}
      </Tabs> */}
      <Button
        className="text-sm bg-content1"
        color="default"
        size="sm"
        onPress={handleReset}
      >
        초기화
      </Button>
    </div>
  );
};

export default ChatHeader;
