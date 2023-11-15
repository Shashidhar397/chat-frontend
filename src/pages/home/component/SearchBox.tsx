import {Fragment, useEffect, useState} from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { get } from "../../../utils/apiUtils";
import { User } from "../../../types/type";

interface SearchBoxProps {
    user: User;
    onUserSelect: (user: User) => void;
}
export default function SearchBox({user, onUserSelect}: SearchBoxProps) {
    const [selected, setSelected] = useState(null);
    const [query, setQuery] = useState("");
    const [searchedUsers, setsearchedUsers] = useState<User[]>([]);

    const handleSearchUser = (event: any) => {
        const searchResponse = get<User[]>("/users/searchUser?searchTerm=" + event.target.value);
        searchResponse.then(response => {
            response = response.filter(responseUser => user.uuid !== responseUser.uuid)
            setsearchedUsers(response);
        })


    };

    useEffect(() => {
       if(selected) {
           onUserSelect(selected);
       }
    }, [selected]);


    return (
        <div className="flex justify-center items-center">
            <div className="top-10 w-72">
                <Combobox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                            <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                placeholder="search user"
                                onChange={(event) => handleSearchUser(event)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery("")}
                        >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {query.length > 0 && (
                                    <Combobox.Option value={{ id: null, name: query }}>
                                        Create "{query}"
                                    </Combobox.Option>
                                )}

                                {searchedUsers.length === 0 && query !== "" ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                    </div>
                                ) : (
                                    searchedUsers.map((user) => (
                                        <Combobox.Option
                                            key={user.uuid}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? "bg-teal-600 text-white" : "text-gray-900"
                                                }`
                                            }
                                            value={user}
                                        >
                                            {({ selected, active }) => (
                                                <>
                          <span
                              className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                              }`}
                          >
                            {user.userName}
                          </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                active ? "text-white" : "text-teal-600"
                                                            }`}
                                                        >
                              <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                              />
                            </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>
        </div>
    );
}