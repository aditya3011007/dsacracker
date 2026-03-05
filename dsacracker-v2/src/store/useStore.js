import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import questionData from '../data'; // Assuming data exports the array default

export const useStore = create(
    persist(
        (set, get) => ({
            lcUsername: '',
            lcStats: null,
            token: null,
            user: null,
            setLcData: (username, stats) => set({ lcUsername: username, lcStats: stats }),
            setAuth: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),

            data: questionData.map((topic) => ({
                ...topic,
                started: false,
                doneQuestions: 0,
                questions: topic.questions.map((q) => ({
                    ...q,
                    Done: false,
                    Bookmark: false,
                    Notes: '',
                })),
            })),

            toggleQuestionDone: (topicName, index, isDone) =>
                set((state) => {
                    const newData = [...state.data];
                    const topicIndex = newData.findIndex((t) => t.topicName === topicName);
                    if (topicIndex !== -1) {
                        const topic = newData[topicIndex];
                        const q = topic.questions[index];
                        if (q) {
                            q.Done = isDone;
                            // Recalculate doneQuestions
                            topic.doneQuestions = topic.questions.filter((q) => q.Done).length;
                            topic.started = topic.doneQuestions > 0;
                        }
                    }
                    get().throttleSyncUp({ data: newData });
                    return { data: newData };
                }),

            toggleBookmark: (topicName, index) =>
                set((state) => {
                    const newData = [...state.data];
                    const topicIndex = newData.findIndex((t) => t.topicName === topicName);
                    if (topicIndex !== -1) {
                        newData[topicIndex].questions[index].Bookmark = !newData[topicIndex].questions[index].Bookmark;
                    }
                    get().throttleSyncUp({ data: newData });
                    return { data: newData };
                }),

            saveNote: (topicName, index, note) =>
                set((state) => {
                    const newData = [...state.data];
                    const topicIndex = newData.findIndex((t) => t.topicName === topicName);
                    if (topicIndex !== -1) {
                        newData[topicIndex].questions[index].Notes = note;
                    }
                    get().throttleSyncUp({ data: newData });
                    return { data: newData };
                }),

            resetData: () => set({ data: questionData }),

            // Cloud Sync Actions
            syncDown: async (tokenOverride) => {
                const token = tokenOverride || get().token;
                if (!token) return;
                try {
                    const res = await fetch('http://localhost:5005/api/progress', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const { progressData, lcUsername } = await res.json();
                        if (progressData) {
                            set({ data: progressData });
                        }
                        if (lcUsername) {
                            set({ lcUsername });
                        }
                    }
                } catch (e) {
                    console.error("Failed to sync down", e);
                }
            },

            // Auto-trigger this when mutations occur. Throttled so we don't spam the DB.
            throttleSyncUp: (updatedState) => {
                const token = get().token;
                if (!token) return;

                // Clear any pending timeout
                if (window.syncTimeout) clearTimeout(window.syncTimeout);

                window.syncTimeout = setTimeout(async () => {
                    try {
                        await fetch('http://localhost:5005/api/progress', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                progressData: updatedState.data || get().data,
                                lcUsername: get().lcUsername
                            })
                        });
                    } catch (e) {
                        console.error("Failed to sync up", e);
                    }
                }, 2000); // Debounce 2 seconds
            }

        }),
        {
            name: 'dsacracker-v2-storage',
        }
    )
);
