package com.hostel.config;

import java.util.List;
import java.util.Map;

/**
 * SQL identifiers are hard-coded here; never accept table or column names from the request.
 * Change these names to match the actual Oracle schema used in your Week 1 database design.
 */
public record ResourceConfig(String table, String primaryKey, List<String> columns) {
    public static final Map<String, ResourceConfig> RESOURCES = Map.of(
        "students", new ResourceConfig("STUDENTS", "STUDENT_ID",
            List.of("STUDENT_ID", "REG_NO", "STUDENT_NAME", "EMAIL", "PHONE", "GENDER", "DEPARTMENT")),
        "hostels", new ResourceConfig("HOSTELS", "HOSTEL_ID",
            List.of("HOSTEL_ID", "HOSTEL_NAME", "WARDEN_NAME", "LOCATION")),
        "room-types", new ResourceConfig("ROOM_TYPES", "ROOM_TYPE_ID",
            List.of("ROOM_TYPE_ID", "TYPE_NAME", "CAPACITY", "FEE")),
        "rooms", new ResourceConfig("ROOMS", "ROOM_ID",
            List.of("ROOM_ID", "HOSTEL_ID", "ROOM_TYPE_ID", "ROOM_NUMBER", "CAPACITY", "OCCUPIED_BEDS", "STATUS")),
        "applications", new ResourceConfig("APPLICATIONS", "APPLICATION_ID",
            List.of("APPLICATION_ID", "STUDENT_ID", "PREFERRED_HOSTEL_ID", "ROOM_TYPE_ID", "APPLICATION_DATE", "STATUS")),
        "allocations", new ResourceConfig("ALLOCATIONS", "ALLOCATION_ID",
            List.of("ALLOCATION_ID", "APPLICATION_ID", "STUDENT_ID", "ROOM_ID", "CHECK_IN_DATE", "CHECK_OUT_DATE", "STATUS")),
        "payments", new ResourceConfig("PAYMENTS", "PAYMENT_ID",
            List.of("PAYMENT_ID", "STUDENT_ID", "ALLOCATION_ID", "AMOUNT", "PAYMENT_DATE", "PAYMENT_METHOD", "STATUS"))
    );

    public static ResourceConfig get(String name) { return RESOURCES.get(name); }
}
